import { useState } from 'react'
import type { ImgHTMLAttributes, ReactNode } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwQzQ1NS4yMjggMzAwIDUwMCAzNDQuNzcyIDUwMCA0MDBDNTAwIDQ1NS4yMjggNDU1LjIyOCA1MDAgNDAwIDUwMEMzNDQuNzcyIDUwMCAzMDAgNDU1LjIyOCAzMDAgNDAwQzMwMCAzNDQuNzcyIDM0NC43NzIgMzAwIDQwMCAzMDBaIiBmaWxsPSIjQTg4QjVDIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTM1MCAzNTBINTQ1TDUwMCA1NTBIMzAwTDM1MCAzNTBaIiBmaWxsPSIjQTg4QjVDIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cmVjdCB4PSIzODAiIHk9IjM4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNSIgc3Ryb2tlPSIjQTg4QjVDIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjMiLz4KPHBhdGggZD0iTTQwMCAzNTBWNDUwTTM1MCA0MDBINDUwIiBzdHJva2U9IiNBOOTg5NUQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4='

// Backend URL should match the one in api.ts
const BACKEND_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000')
  : ''; // In production, we assume relative paths or configured proxy

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
        // Special case: if it's a full URL but contains spaces, encode them
        if (imageSrc.includes(' ')) {
          return encodeURI(imageSrc);
        }
        return imageSrc;
      }

      // If it's a backend upload (starts with /uploads), prepend backend URL
      if (imageSrc.startsWith('/uploads')) {
        const fullUrl = `${BACKEND_URL}${imageSrc}`;
        return encodeURI(fullUrl);
      }

      // If it's a relative path starting with /, encode the entire path properly
      if (imageSrc.startsWith('/')) {
        // For paths with spaces, we need to encode each segment
        const parts = imageSrc.split('/');
        const encodedParts = parts.map((part, index) => {
          if (index === 0 || !part) return part; // Keep the leading slash and empty parts
          // Encode the filename part (spaces become %20, etc.)
          return encodeURIComponent(part);
        });
        return encodedParts.join('/');
      }

      // For relative paths without leading slash, add it and encode
      return '/' + encodeURIComponent(imageSrc);
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
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
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
