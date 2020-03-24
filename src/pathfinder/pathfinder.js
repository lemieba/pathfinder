import React from 'react';
import Node from './node';

import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

export default class Pathfinder extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        grid : [],
        mouseIsPressed: false,
      };
    }

    componentDidMount() {
      const grid = createGrid();
      this.setState({grid});
    }

    handleMouseDown(row, col) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
      if (!this.state.mouseIsPressed) return;
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }

    handleMouseUp() {
      this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
          setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder);
          }, 10 * i);
          return;
        }
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          if (!((node.row === START_NODE_ROW && node.col === START_NODE_COL) || (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL))) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }
        }, 10 * i);
      }
    }

    animateShortestPath(nodesInShortestPathOrder) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          if (!((node.row === START_NODE_ROW && node.col === START_NODE_COL) || (node.row === FINISH_NODE_ROW && node.col === FINISH_NODE_COL))) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-shortest-path';
          }
        }, 50 * i);
      }
    }

    visualizeDijkstra() {
      const {grid} = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    render() {
      return (
        <>
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstras Algorithm
          </button>
          <div className="grid">
            {this.state.grid.map((row, rowIdx) => {
              return (<div className="" key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  return (
                    <Node
                      key={nodeIdx}
                      row={node.row}
                      col={node.col}
                      isFinish={node.isFinish}
                      isStart={node.isStart}
                      isWall={node.isWall}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}>
                    </Node>
                  );
                })}
              </div>);
            })}
          </div>
        </>
      );
    }
  }
  

const START_NODE_ROW = 10;
const START_NODE_COL = 9;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 30;
const createNode = (row, col) =>{
  return {
    row: row,
    col: col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
  const createGrid = () => {
    const grid = []
    for (var row = 0; row < 20; row++){
      const rowlist = []
      for (var col = 0; col < 37; col++) {
        rowlist.push(createNode(row, col));
      }
      grid.push(rowlist);
    }
    return grid;
  };

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }