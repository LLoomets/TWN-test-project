import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 400;
const RESOLUTION = 10; 

export type Bit = 0 | 1;
export type BitArray = Bit[];

@Component({
  selector: 'app-game-of-life',
  imports: [],
  templateUrl: './game-of-life.component.html',
  styleUrl: './game-of-life.component.scss',
})
export class GameOfLifeComponent implements AfterViewInit {
  @ViewChild('gameboard', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  gameBoard!: BitArray[];

  ngAfterViewInit(): void {
    this.canvas.nativeElement.width = BOARD_WIDTH;
    this.canvas.nativeElement.height = BOARD_HEIGHT;

    this.ctx = this.canvas.nativeElement.getContext('2d')!;

    const numOfRows = BOARD_HEIGHT / RESOLUTION;
    const numOfCols = BOARD_WIDTH / RESOLUTION;

    const oneOrZero = () => (Math.random() > 0.5 ? 1 : 0);

    const board: BitArray[] = new Array(numOfRows)
      .fill(0)
      .map(() => new Array(numOfCols).fill(0).map(oneOrZero));

    this.gameBoard = board;

    console.log(this.gameBoard);
  }
}
