export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const status = response.status;
    const text = await response.text();

    if (!text || text.trim() === '') {
      if (response.ok) {
        return {
          success: true,
          status,
          message: 'Operation completed successfully (empty response).',
        };
      }
      return {
        success: false,
        status,
        error: `Server returned HTTP ${status} with empty response body.`,
      };
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(text);
    } catch (parseErr) {
      console.error(
        `[API Parse Error] ${url} (HTTP ${status}): Invalid JSON response`,
        text.slice(0, 150)
      );
      return {
        success: false,
        status,
        error: response.ok
          ? 'Server returned non-JSON response format.'
          : `HTTP ${status}: ${text.slice(0, 100)}`,
      };
    }

    if (!response.ok) {
      const errMsg =
        parsedData?.error ||
        parsedData?.message ||
        `HTTP ${status} Request Failed`;
      return {
        success: false,
        status,
        error: errMsg,
        data: parsedData,
      };
    }

    return {
      success: true,
      status,
      data: parsedData?.data !== undefined ? parsedData.data : parsedData,
      message: parsedData?.message,
    };
  } catch (netErr: any) {
    console.error(`[Network Error] ${url}:`, netErr?.message || netErr);
    return {
      success: false,
      status: 0,
      error: netErr?.message || 'Network error connecting to server.',
    };
  }
}
