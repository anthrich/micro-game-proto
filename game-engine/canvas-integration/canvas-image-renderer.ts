import IDrawable from "../drawable";
import Vector2 from "../vector2";

export class CanvasImageRenderer implements IDrawable {
	
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
		if (!this.image.complete) return;
		this.ctx.drawImage(this.image, position.x, position.y);
		this.ctx.beginPath();
		this.ctx.arc(position.x, position.y, 1, 0, Math.PI * 2, true);
		this.ctx.closePath();
		this.ctx.fillStyle = "red";
		this.ctx.fill();
	}
}