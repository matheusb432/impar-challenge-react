import styles from './style.module.scss';

interface ImageProps {
  src: string;
  alt?: string;
}

const Image = ({ src, alt = 'image' }: ImageProps) => {
  return <img src={src} alt={alt}></img>;
};

export default Image;
