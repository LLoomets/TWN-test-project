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

    this.render(this.gameBoard);
  }

  render(board: BitArray[]) {
    const c = this.ctx;
    const res = RESOLUTION;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        c.beginPath();
        c.rect(colIndex * res, rowIndex * res, res, res);
        c.fillStyle = cell ? 'black' : 'white';
        c.fill();
        c.stroke();
        c.closePath();
      });
    });
  }

  private createNextGeneration(board: BitArray[]) {
    const nextGeneration: BitArray[] = board.map((innerArr) => [...innerArr]);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const rowAbove = board[rowIndex - 1] || [];
        const rowBelow = board[rowIndex + 1] || [];
        const fieldBefore = board[rowIndex][colIndex - 1];
        const fieldAfter = board[rowIndex][colIndex + 1];

        const countOfLivingNeighbors = [
          rowAbove[colIndex - 1],
          rowAbove[colIndex],
          rowAbove[colIndex + 1],
          rowBelow[colIndex - 1],
          rowBelow[colIndex],
          rowBelow[colIndex + 1],
          fieldBefore,
          fieldAfter,
        ].reduce((pv, cv) => (cv != null ? pv + cv : pv), 0 as number);

        const becomeLivingCellInAnyCase = countOfLivingNeighbors === 3;
        const keepAlive = cell && countOfLivingNeighbors === 2;

        const newCellValue = becomeLivingCellInAnyCase || keepAlive ? 1 : 0;

        nextGeneration[rowIndex][colIndex] = newCellValue;
      });
    });

    this.gameBoard = nextGeneration;
  }
}
