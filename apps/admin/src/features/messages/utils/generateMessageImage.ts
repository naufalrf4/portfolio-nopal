const INSTAGRAM_STORY_WIDTH = 1080;
const INSTAGRAM_STORY_HEIGHT = 1920;

interface ImageGeneratorOptions {
  message: {
    content: string;
    createdAt: string;
  };
  onProgress?: (progress: number) => void;
}

const COLORS = {
  background: '#E0E5EC',
  surface: '#E0E5EC',
  text: '#3D4852',
  textMuted: '#6B7280',
  textSubtle: '#A0AEC0',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  accentGradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  white: '#FFFFFF',
  shadow: {
    dark: 'rgb(163, 177, 198, 0.6)',
    darkStrong: 'rgb(163, 177, 198, 0.7)',
    light: 'rgba(255, 255, 255, 0.5)',
    lightStrong: 'rgba(255, 255, 255, 0.6)',
  },
};

export async function generateMessageImage({
  message,
  onProgress,
}: ImageGeneratorOptions): Promise<Blob> {
  if (typeof window === 'undefined') {
    throw new Error('Image generation only works in browser');
  }

  const domtoimage = await import('dom-to-image-more');

  onProgress?.(10);

  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    width: ${INSTAGRAM_STORY_WIDTH}px;
    height: ${INSTAGRAM_STORY_HEIGHT}px;
    border: none;
    visibility: hidden;
  `;
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error('Failed to access iframe document');
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            width: ${INSTAGRAM_STORY_WIDTH}px;
            height: ${INSTAGRAM_STORY_HEIGHT}px;
            font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
            overflow: hidden;
            background: ${COLORS.background};
            display: flex;
            flex-direction: column;
            padding: 0;
            position: relative;
          }

          .decorative-dots {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
          }

          .dot {
            position: absolute;
            border-radius: 50%;
            background: ${COLORS.accent};
            opacity: 0.05;
          }

          .dot-1 {
            width: 400px;
            height: 400px;
            top: 10%;
            left: -120px;
          }

          .dot-2 {
            width: 280px;
            height: 280px;
            top: 55%;
            right: -80px;
          }

          .dot-3 {
            width: 180px;
            height: 180px;
            bottom: 15%;
            left: 8%;
          }

          .top-header {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 64px 60px 40px 60px;
            position: relative;
            z-index: 1;
          }

          .header-pill {
            display: inline-flex;
            align-items: center;
            gap: 16px;
            padding: 16px 36px 16px 20px;
            background: ${COLORS.surface};
            border-radius: 9999px;
            box-shadow: 
              9px 9px 16px ${COLORS.shadow.dark},
              -9px -9px 16px ${COLORS.shadow.light};
          }

          .header-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: ${COLORS.accentGradient};
            box-shadow: 
              0 6px 16px rgba(59, 130, 246, 0.3),
              inset 0 2px 2px rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .header-text {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 34px;
            font-weight: 700;
            color: ${COLORS.text};
            letter-spacing: -0.5px;
            white-space: nowrap;
          }

          .main-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 60px;
            gap: 56px;
            position: relative;
            z-index: 1;
          }

          .badge-container {
            display: flex;
            justify-content: center;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 18px;
            padding: 28px 72px;
            background: ${COLORS.accentGradient};
            border-radius: 9999px;
            box-shadow: 
              0 12px 48px rgba(59, 130, 246, 0.4),
              0 8px 24px rgba(59, 130, 246, 0.35),
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(0, 0, 0, 0.15);
            position: relative;
          }

          .badge::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 28px;
            right: 28px;
            height: 40%;
            background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%);
            border-radius: 9999px 9999px 50% 50%;
          }

          .badge-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .badge-text {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 38px;
            font-weight: 800;
            color: ${COLORS.white};
            letter-spacing: 1px;
            text-transform: uppercase;
            text-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
            white-space: nowrap;
          }

          .message-card-wrapper {
            width: 100%;
            max-width: 920px;
          }

          .message-card {
            background: ${COLORS.surface};
            border-radius: 32px;
            padding: 10px;
            box-shadow: 
              12px 12px 24px ${COLORS.shadow.darkStrong},
              -12px -12px 24px ${COLORS.shadow.lightStrong};
            position: relative;
          }

          .message-inner-frame {
            background: ${COLORS.surface};
            border-radius: 24px;
            padding: 8px;
            box-shadow: 
              inset 10px 10px 20px ${COLORS.shadow.darkStrong},
              inset -10px -10px 20px ${COLORS.shadow.lightStrong};
          }

          .message-content-area {
            background: ${COLORS.background};
            border-radius: 18px;
            padding: 60px 52px;
            position: relative;
            min-height: 240px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .quote-decoration {
            position: absolute;
            top: 16px;
            left: 28px;
            font-size: 120px;
            font-family: Georgia, "Times New Roman", serif;
            color: ${COLORS.accent};
            opacity: 0.1;
            line-height: 1;
            font-weight: bold;
          }

          .quote-decoration-end {
            position: absolute;
            bottom: -8px;
            right: 28px;
            font-size: 120px;
            font-family: Georgia, "Times New Roman", serif;
            color: ${COLORS.accent};
            opacity: 0.1;
            line-height: 1;
            font-weight: bold;
            transform: rotate(180deg);
          }

          .message-text {
            font-family: 'DM Sans', sans-serif;
            font-size: 42px;
            line-height: 1.65;
            color: ${COLORS.text};
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            white-space: pre-wrap;
            text-align: center;
            font-weight: 500;
            position: relative;
            z-index: 1;
            max-width: 100%;
            hyphens: auto;
          }

          .footer-section {
            padding: 36px 60px 72px 60px;
            position: relative;
            z-index: 1;
          }

          .footer-card {
            background: ${COLORS.surface};
            border-radius: 32px;
            padding: 40px 52px;
            box-shadow: 
              9px 9px 16px ${COLORS.shadow.dark},
              -9px -9px 16px ${COLORS.shadow.light};
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
          }

          .footer-cta {
            font-family: 'DM Sans', sans-serif;
            font-size: 28px;
            font-weight: 500;
            color: ${COLORS.textMuted};
            letter-spacing: 0.2px;
          }

          .footer-url-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .footer-url {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 44px;
            font-weight: 800;
            background: ${COLORS.accentGradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.8px;
            white-space: nowrap;
          }
        </style>
      </head>
      <body>
        <div class="decorative-dots">
          <div class="dot dot-1"></div>
          <div class="dot dot-2"></div>
          <div class="dot dot-3"></div>
        </div>

        <div class="top-header">
          <div class="header-pill">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${COLORS.white}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div class="header-text">Anon Message</div>
          </div>
        </div>

        <div class="main-wrapper">
          <div class="badge-container">
            <div class="badge">
              <div class="badge-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="${COLORS.white}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <span class="badge-text">New Message!</span>
            </div>
          </div>

          <div class="message-card-wrapper">
            <div class="message-card">
              <div class="message-inner-frame">
                <div class="message-content-area">
                  <span class="quote-decoration">"</span>
                  <span class="quote-decoration-end">"</span>
                  <div class="message-text">${escapeHtml(message.content)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-section">
          <div class="footer-card">
            <div class="footer-cta">Send me anonymous messages too!</div>
            <div class="footer-url-container">
              <span class="footer-url">ngl.naufalrf.tech</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  onProgress?.(30);

  await new Promise((resolve) => setTimeout(resolve, 400));

  onProgress?.(50);

  try {
    const iframeBody = iframeDoc.body;

    const blob = await domtoimage.toBlob(iframeBody, {
      width: INSTAGRAM_STORY_WIDTH,
      height: INSTAGRAM_STORY_HEIGHT,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    onProgress?.(80);

    document.body.removeChild(iframe);

    onProgress?.(100);
    return blob;
  } catch (error) {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    throw error;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function downloadMessageImage(
  message: { content: string; createdAt: string },
  onProgress?: (progress: number) => void
): Promise<void> {
  const blob = await generateMessageImage({ message, onProgress });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `anonymous-message-${Date.now()}.png`;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export async function shareToInstagramStory(
  message: { content: string; createdAt: string },
  onProgress?: (progress: number) => void
): Promise<void> {
  const blob = await generateMessageImage({ message, onProgress });

  const file = new File([blob], 'anonymous-message.png', { type: 'image/png' });

  if (navigator.share && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'Anonymous Message',
      text: 'Check out this anonymous message I received!',
    });
  } else {
    throw new Error('Web Share API not supported on this device');
  }
}
