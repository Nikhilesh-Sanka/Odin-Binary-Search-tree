class Node {
  constructor(data) {
    this.data = data;
    this.right = null;
    this.left = null;
  }
}
function checkFunction(func) {
  if (typeof func !== "function") {
    throw new Error("Enter a valid function");
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(
      this.sortArray(array),
      0,
      this.sortArray(array).length - 1
    );
  }
  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }
    let middle = Math.floor((start + end) / 2);
    let newNode = new Node(array[middle]);
    newNode.left = this.buildTree(array, start, middle - 1);
    newNode.right = this.buildTree(array, middle + 1, end);
    return newNode;
  }
  sortArray(array) {
    array.sort((a, b) => a - b);
    array = array.filter((num, index) => {
      if (num === array[index - 1]) {
        return false;
      } else {
        return true;
      }
    });
    return array;
  }
  insertValue(value) {
    let currentNode = this.root;
    let beforeNode;
    while (currentNode !== null) {
      if (currentNode.data === value) {
        return;
      }
      if (currentNode.data > value) {
        beforeNode = currentNode;
        currentNode = currentNode.left;
        continue;
      }
      beforeNode = currentNode;
      currentNode = currentNode.right;
    }
    if (beforeNode.data > value) {
      beforeNode.left = new Node(value);
      return;
    }
    beforeNode.right = new Node(value);
  }
  deleteValue(value) {
    let currentNode = this.root;
    let parentNode;
    while (currentNode !== null) {
      if (currentNode.data === value) {
        break;
      }
      if (currentNode.data > value) {
        parentNode = [currentNode, "left"];
        currentNode = currentNode.left;
        continue;
      }
      parentNode = [currentNode, "right"];
      currentNode = currentNode.right;
    }
    if (currentNode === null) {
      return;
    } else if (currentNode.left === null && currentNode.right === null) {
      parentNode[0][parentNode[1]] = null;
      return;
    } else if (currentNode.left === null || currentNode.right === null) {
      parentNode[0][parentNode[1]] =
        currentNode.left !== null ? currentNode.left : currentNode.right;
      return;
    } else {
      let nextNodeArray = this.getNextHighestNode(currentNode);
      currentNode.data = nextNodeArray[0].data;
      nextNodeArray[1][0][nextNodeArray[1][1]] = nextNodeArray[0].right;
    }
  }
  getNextHighestNode(node) {
    let currentNode = node.right;
    let parentNode = node;
    if (currentNode.left === null) {
      return [currentNode, [parentNode, "right"]];
    }
    while (currentNode.left !== null) {
      parentNode = currentNode;
      currentNode = currentNode.left;
    }
    return [currentNode, [parentNode, "left"]];
  }
  find(value) {
    let currentNode = this.root;
    while (currentNode !== null) {
      if (currentNode.data === value) {
        return currentNode;
      } else {
        if (currentNode.data > value) {
          currentNode = currentNode.left;
        } else {
          currentNode = currentNode.right;
        }
      }
    }
    return null;
  }
  levelOrder(callback) {
    checkFunction(callback);
    let queue = [this.root];
    function pushChildren() {
      let parent = queue[0];
      if (parent.right === null && parent.left === null) {
        return;
      } else if (parent.left === null || parent.right === null) {
        queue.push(parent.right === null ? parent.left : parent.right);
        return;
      } else {
        queue.push(parent.left);
        queue.push(parent.right);
      }
    }
    while (queue.length !== 0) {
      pushChildren();
      callback(queue[0]);
      queue.shift();
    }
  }
  inOrder(callback) {
    checkFunction(callback);
    function recursive(rootNode) {
      if (rootNode.left !== null) {
        recursive(rootNode.left);
      }
      callback(rootNode);
      if (rootNode.right !== null) {
        recursive(rootNode.right);
      }
    }
    recursive(this.root, this.root.left, this.root.right);
  }
  preOrder(callback) {
    checkFunction(callback);
    function recursive(rootNode) {
      callback(rootNode);
      if (rootNode.left !== null) {
        recursive(rootNode.left);
      }
      if (rootNode.right !== null) {
        recursive(rootNode.right);
      }
    }
    recursive(this.root);
  }
  postOrder(callback) {
    checkFunction(callback);
    function recursive(rootNode) {
      if (rootNode.left !== null) {
        recursive(rootNode.left);
      }
      if (rootNode.right !== null) {
        recursive(rootNode.right);
      }
      callback(rootNode);
    }
    recursive(this.root);
  }
  height(node) {
    function recursive(node) {
      if (node === null) {
        return 0;
      }
      if (node.right === null && node.left === null) {
        return 1;
      }
      let leftNodeHeight = recursive(node.left);
      let rightNodeHeight = recursive(node.right);
      return (
        (leftNodeHeight >= rightNodeHeight ? leftNodeHeight : rightNodeHeight) +
        1
      );
    }
    return recursive(node) - 1;
  }
  depth(node) {
    let count = -1;
    let currentNode = this.root;
    while (currentNode !== null) {
      if (currentNode.data === node.data) {
        return count <= 0 ? 0 : count;
      }
      count++;
      if (currentNode.data > node.data) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }
    return null;
  }
  isBalanced() {
    let isTreeBalanced = true;
    this.levelOrder((node) => {
      if (Math.abs(this.height(node.left) - this.height(node.right))) {
        isTreeBalanced = false;
      }
    });
    return isTreeBalanced;
  }
  reBalance() {
    let newArray = [];
    this.inOrder((node) => {
      newArray.push(node.data);
    });
    this.root = this.buildTree(newArray, 0, newArray.length - 1);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
