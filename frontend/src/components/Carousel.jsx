import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { bannerImagesData } from "../data/Data";

const Carousel = () => {
  return (
    <section>
      <Slide duration={5000} easing="ease" transitionDuration={500}>
        {bannerImagesData.map((image) => {
          return (
            <div
              key={image.id}
              className="carousel-image"
              style={{
                backgroundImage: `url(${image.imageUrl})`,
              }}
            ></div>
          );
        })}
      </Slide>
    </section>
  );
};

export default Carousel;
