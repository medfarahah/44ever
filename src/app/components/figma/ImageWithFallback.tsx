import { useState } from 'react'
import type { ImgHTMLAttributes, ReactNode } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwQzQ1NS4yMjggMzAwIDUwMCAzNDQuNzcyIDUwMCA0MDBDNTAwIDQ1NS4yMjggNDU1LjIyOCA1MDAgNDAwIDUwMEMzNDQuNzcyIDUwMCAzMDAgNDU1LjIyOCAzMDAgNDAwQzMwMCAzNDQuNzcyIDM0NC43NzIgMzAwIDQwMCAzMDBaIiBmaWxsPSIjQTg4QjVDIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTM1MCAzNTBINTQ1TDUwMCA1NTBIMzAwTDM1MCAzNTBaIiBmaWxsPSIjQTg4QjVDIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIzODAiIHk9IjM4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNSIgc3Ryb2tlPSIjQTg4QjVDIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjMiLz4KPHBhdGggZD0iTTQwMCAzNTBWNDUwTTM1MCA0MDBINDUwIiBzdHJva2U9IiNBOOTg5NUQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4='

// Backend URL should match the one in api.ts
const BACKEND_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5001/api')
  : (import.meta.env.VITE_API_URL || '/api');

// Important: Strip trailing slash if present in BACKEND_URL and ensure it ends with /api if needed
const CLEAN_BACKEND_URL = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
}

export function ImageWithFallback({ src, alt, style, className, fallback, ...rest }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', {
      src: src?.substring(0, 100),
      alt,
      error: e
    });
    setDidError(true)
  }

  // Normalize image path - handle relative paths and encode spaces
  const normalizeImageSrc = (imageSrc: string | undefined | null): string => {
    if (!imageSrc || typeof imageSrc !== 'string') {
      return ERROR_IMG_SRC;
    }

    try {
      // If it's already a data URL or full URL, return as is
      if (imageSrc.startsWith('data:') || imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('blob:')) {
        return imageSrc.includes(' ') ? encodeURI(imageSrc) : imageSrc;
      }

      // If it's a backend upload (starts with /uploads), prepend backend URL
      if (imageSrc.startsWith('/uploads')) {
        return encodeURI(`${CLEAN_BACKEND_URL}${imageSrc}`);
      }

      // For everything else, assume it's a relative path and just encodeURI for spaces
      return encodeURI(imageSrc.startsWith('/') ? imageSrc : '/' + imageSrc);
    } catch (error) {
      console.error('Error normalizing image src:', error, imageSrc);
      return imageSrc; // Return original if encoding fails
    }
  }

  const normalizedSrc = normalizeImageSrc(src);

  // Log image source for debugging in development only
  if (import.meta.env.DEV) {
    console.log('ImageWithFallback:', {
      originalSrc: src?.substring(0, 50),
      normalizedSrc: normalizedSrc?.substring(0, 50),
      hasError: didError
    });
  }

  if (didError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-2">
          <img src={ERROR_IMG_SRC} alt="Error" className="w-8 h-8 opacity-50 mb-2" />
          <span className="text-[10px] text-gray-500 font-mono break-all line-clamp-2">{src}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
      onLoad={() => {
        console.log('✅ ImageWithFallback: Image loaded successfully', {
          src: normalizedSrc?.substring(0, 50),
          alt
        });
      }}
      loading="lazy"
    />
  );
}
