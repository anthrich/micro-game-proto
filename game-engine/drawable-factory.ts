import CircleRenderer from "./circle-renderer";
interface IDrawableFactory {
  getCircleRenderer() : CircleRenderer;
}

export default IDrawableFactory;
