import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 400;
const RESOLUTION = 10; 

@Component({
  selector: 'app-game-of-life',
  imports: [],
  templateUrl: './game-of-life.component.html',
  styleUrl: './game-of-life.component.scss'
})
export class GameOfLifeComponent implements AfterViewInit {
  @ViewChild('gameboard', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
      this.canvas.nativeElement.width = BOARD_WIDTH;
      this.canvas.nativeElement.height = BOARD_HEIGHT;

      this.ctx = this.canvas.nativeElement.getContext('2d')!;

      this.ctx.strokeStyle = 'white';
      this.ctx.strokeRect(450, 150, 100, 100);
  }
}
