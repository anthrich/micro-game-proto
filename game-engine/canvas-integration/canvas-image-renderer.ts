import IDrawable from "../drawable";
import Vector2 from "../vector2";

class CanvasImageRenderer implements IDrawable {
	
	private canvas : HTMLCanvasElement;
	private ctx : CanvasRenderingContext2D;
	private image : HTMLImageElement;
	
	constructor(imageUrl : string, canvas: HTMLCanvasElement) {
		this.image = new Image();
		this.image.src = imageUrl;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
	}
	
	draw(position: Vector2) {
		if(!this.image.complete) return;
		this.ctx.drawImage(this.image, position.x, position.y);
	}
}