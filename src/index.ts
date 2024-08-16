import { nanoid } from "nanoid";
import fs from "fs/promises";
import path from "path";

import type {
  DashboardListItem,
  DashboardResponse,
  SimplifiedDashboardItem,
  SimplifiedPanel,
} from "./types";

export type ApiClientOptions = {
  apiKey: string;
  baseUrl: string;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiRequest<T = unknown> = {
  path: string;
  method: HttpMethod;
  body?: T;
  query?: Record<string, string> | null;
  responseType?: "json" | "arraybuffer" | "blob" | "text";
};

export class SlackGrafanaRender {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(opts: ApiClientOptions) {
    this.baseUrl = opts.baseUrl;
    this.apiKey = opts.apiKey;
  }

  private async request<TResponse, TBody = unknown>(
    req: ApiRequest<TBody>
  ): Promise<TResponse> {
    const url = new URL(`${this.baseUrl}${req.path}`);
    if (req.query) {
      Object.entries(req.query).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }
    const init: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
    if (req.body) {
      init.body = JSON.stringify(req.body);
    }

    const response = await fetch(url.toString(), init);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    switch (req.responseType) {
      case "arraybuffer":
        return response.arrayBuffer() as Promise<TResponse>;
      case "blob":
        return response.blob() as Promise<TResponse>;
      case "text":
        return response.text() as Promise<TResponse>;
      case "json":
      default:
        return response.json() as Promise<TResponse>;
    }
  }

  public readonly dashboards = {
    list: async (): Promise<SimplifiedDashboardItem[]> => {
      const response: DashboardListItem[] = await this.request({
        path: "/api/search",
        method: "GET",
        query: {
          type: "dash-db",
        },
      });

      return response.map((item) => ({
        id: item.id,
        uid: item.uid,
        title: item.title,
        uri: item.uri,
        tags: item.tags,
      }));
    },
    byUid: async (uid: string): Promise<SimplifiedPanel[]> => {
      const response: DashboardResponse = await this.request({
        path: `/api/dashboards/uid/${uid}`,
        method: "GET",
      });

      return response.dashboard.panels.map((panel) => ({
        id: panel.id,
        title: panel.title,
        type: panel.type,
      }));
    },
  };

  public readonly render = {
    dashboard: async (
      dashboardUid: string,
      orgId: number,
      from: number,
      to: number,
      panelId: number,
      width: number = 1000,
      height: number = 500,
      tz: string = "UTC",
      scale: number = 1,
      fileName: string = `dashboard_${nanoid()}.png`,
      pathFile: string = "tmp"
    ): Promise<string> => {
      const response = await this.request<ArrayBuffer>({
        path: `/render/d-solo/${dashboardUid}/graph-panel`,
        method: "GET",
        query: {
          orgId: orgId.toString(),
          from: from.toString(),
          to: to.toString(),
          panelId: panelId.toString(),
          width: width.toString(),
          height: height.toString(),
          tz,
          scale: scale.toString(),
        },
        responseType: "arraybuffer",
      });

      const filePath = path.join(pathFile, fileName);
      // Save the image to a file in the tmp directory for default
      await fs.writeFile(filePath, Buffer.from(response));

      // return the path of the file
      return filePath;
    },
  };
}
