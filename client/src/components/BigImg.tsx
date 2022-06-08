import { useState } from "react";

interface BigImgProps {
	alt: string;
}

const BigImg = ({ alt, ...props }: BigImgProps) => {
	const [loaded, setLoaded] = useState(false);
	return (
		<img
			loading="lazy"
			style={loaded ? {} : { opacity: 0 }}
			onLoad={() => setLoaded(true)}
			alt={alt}
			{...props}
		/>
	);
};

export default BigImg;
