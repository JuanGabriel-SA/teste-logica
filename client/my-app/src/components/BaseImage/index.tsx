import { Skeleton } from "@mui/material";
import React, { useState } from "react";

type BaseImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const BaseImage = ({ ...props }: BaseImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width: props.width || 80,
        height: props.height || 80,
        position: "relative",
      }}
    >
      {!loaded && (
        <Skeleton
          animation="wave"
          variant="rounded"
          width={props.width || 80}
          height={props.height || 80}
        />
      )}
      <img {...props} onLoad={() => setLoaded(true)} />
    </div>
  );
};

export default BaseImage;
