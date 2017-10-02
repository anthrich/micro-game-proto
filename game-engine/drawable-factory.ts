import CircleRenderer from "./circle-renderer";
import IDrawable from "./drawable";
interface IDrawableFactory {
  getCircleRenderer() : CircleRenderer;
  getImageRenderer(imgUrl : string) : IDrawable;
}

export default IDrawableFactory;
