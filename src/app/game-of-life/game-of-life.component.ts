import { FormsModule } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

const BOARD_WIDTH = 1000;
const BOARD_HEIGHT = 400;
const RESOLUTION = 10;

export type Bit = 0 | 1;
export type BitArray = Bit[];

@Component({
  selector: 'app-game-of-life',
  imports: [FormsModule, CommonModule],
  templateUrl: './game-of-life.component.html',
  styleUrl: './game-of-life.component.scss',
})
export class GameOfLifeComponent implements AfterViewInit {
  @ViewChild('gameboard', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationInterval: any;
  gameBoard!: BitArray[];

  gridCols = 70;
  gridRows = 30;

  colOptions = [10, 20, 30, 40, 50, 60, 70, 80];
  rowOptions = [10, 20, 30, 40, 50];

  readonly CELL_SIZE = 12;

  tempGridCols = this.gridCols;
  tempGridRows = this.gridRows;

  speed: 'slow' | 'normal' | 'fast' = 'normal';

  private speedDelays = {
    slow: 150,
    normal: 75,
    fast: 25,
  };

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.resetBoard();
    this.animate();
  }

  resetBoard() {
    this.canvas.nativeElement.width = this.gridCols * this.CELL_SIZE;
    this.canvas.nativeElement.height = this.gridRows * this.CELL_SIZE;

    const oneOrZero = () => (Math.random() > 0.5 ? 1 : 0);

    this.gameBoard = new Array(this.gridRows)
      .fill(0)
      .map(() => new Array(this.gridCols).fill(0).map(oneOrZero));
  }

  applyGridSize() {
    this.gridCols = Number(this.tempGridCols);
    this.gridRows = Number(this.tempGridRows);
    this.resetBoard();
  }

  private animate() {
    const step = () => {
      this.render(this.gameBoard);
      this.createNextGeneration(this.gameBoard);

      this.animationInterval = setTimeout(() => {
        step();
      }, this.speedDelays[this.speed]);
    };

    step();
  }

  changeSpeed() {
    clearTimeout(this.animationInterval);
    this.animate();
  }

  private render(board: BitArray[]) {
    const c = this.ctx;
    c.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        c.beginPath();
        c.rect(
          colIndex * this.CELL_SIZE,
          rowIndex * this.CELL_SIZE,
          this.CELL_SIZE,
          this.CELL_SIZE
        );
        c.fillStyle = cell ? 'white' : '#adf0d020';
        c.fill();
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
