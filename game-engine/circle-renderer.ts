import IDrawable from "./drawable";

interface ICircleRenderer extends IDrawable{
    setRadius (radius: number);
    setColor (color: string);
    setOutlineColour (color: string);
}

export default ICircleRenderer;
