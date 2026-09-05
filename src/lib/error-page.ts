export function renderErrorPage(options?: {
  title?: string;
  message?: string;
  errorId?: string;
}): string {
  const title = options?.title ?? "Application Temporarily Unavailable";
  const message =
    options?.message ??
    "An unexpected error occurred while loading this page. Our technical team has been notified.";
  const errorId = options?.errorId ?? `ERR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${title} | ElScholarship</title>
    <style>
      :root {
        --bg: #090d16;
        --card-bg: #111827;
        --card-border: #1f2937;
        --text-main: #f9fafb;
        --text-muted: #9ca3af;
        --primary: #2563eb;
        --primary-hover: #1d4ed8;
        --secondary-bg: #1f2937;
        --secondary-hover: #374151;
        --accent-glow: rgba(37, 99, 235, 0.15);
      }

      @media (prefers-color-scheme: light) {
        :root {
          --bg: #f8fafc;
          --card-bg: #ffffff;
          --card-border: #e2e8f0;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --primary: #1e40af;
          --primary-hover: #1e3a8a;
          --secondary-bg: #f1f5f9;
          --secondary-hover: #e2e8f0;
          --accent-glow: rgba(30, 64, 175, 0.08);
        }
      }

      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: var(--bg);
        color: var(--text-main);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      .container {
        width: 100%;
        max-width: 28rem;
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 1rem;
        padding: 2.5rem 2rem;
        text-align: center;
        box-shadow: 0 20px 25px -5px var(--accent-glow), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.4s ease-out;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .icon-wrapper {
        width: 3.5rem;
        height: 3.5rem;
        margin: 0 auto 1.5rem;
        background: var(--secondary-bg);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary);
      }

      .icon-wrapper svg {
        width: 1.75rem;
        height: 1.75rem;
        stroke: currentColor;
        stroke-width: 2;
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      h1 {
        font-size: 1.35rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        margin-bottom: 0.75rem;
      }

      p {
        color: var(--text-muted);
        font-size: 0.95rem;
        margin-bottom: 1.75rem;
      }

      .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.5rem;
        cursor: pointer;
        text-decoration: none;
        transition: all 0.15s ease;
        border: 1px solid transparent;
      }

      .btn-primary {
        background-color: var(--primary);
        color: #ffffff;
      }

      .btn-primary:hover {
        background-color: var(--primary-hover);
      }

      .btn-secondary {
        background-color: var(--secondary-bg);
        color: var(--text-main);
        border-color: var(--card-border);
      }

      .btn-secondary:hover {
        background-color: var(--secondary-hover);
      }

      .meta {
        margin-top: 2rem;
        padding-top: 1.25rem;
        border-top: 1px solid var(--card-border);
        font-size: 0.75rem;
        color: var(--text-muted);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
    </style>
  </head>
  <body>
    <main class="container" role="alert" aria-live="polite">
      <div class="icon-wrapper" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <h1>${title}</h1>
      <p>${message}</p>
      
      <div class="actions">
        <button class="btn btn-primary" onclick="window.location.reload()">
          Refresh Page
        </button>
        <a class="btn btn-secondary" href="/">
          Return Home
        </a>
      </div>

      <div class="meta">
        Error Reference ID: <span>${errorId}</span>
      </div>
    </main>
  </body>
</html>`;
}
