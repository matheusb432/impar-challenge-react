interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  circular?: boolean;
}

function Image({ src, alt, width, height, circular = false }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ borderRadius: circular ? '100%' : '' }}
    />
  );
}

Image.defaultProps = {
  width: '',
  height: '',
  circular: false,
};

export default Image;
