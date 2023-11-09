export interface INode {
  label: string;
  name: string;
  _id: number | string;
  pLabel?: string;
  children?: Array<INode>;
}

function forEachTree(tree: Array<INode>, callback: (item: INode) => void) {
  tree?.forEach((item: INode) => {
    callback(item);
    forEachTree(item.children as Array<INode>, callback);
  });
  return tree;
}

export class Tree {
  root: Array<INode>;
  constructor(str: string) {
    this.root = this.init(str);
  }

  get list() {
    return this.root;
  }

  init(str: string) {
    const destList: any = [];

    str.split('\n').forEach((path) => {
      const pathList = path.split('/');
      let levelList = destList;
      for (const name of pathList) {
        let obj = levelList.find((item: any) => item.name == name);
        const tt = name.split('_%_%_');
        const _name = tt[0];
        if (!obj) {
          const id = tt[1];
          const type = tt[2];
          obj = {
            label: _name,
            name: _name,
            children: [],
            _id: id,
            _type: type || 'folder',
          };
          if (_name) levelList.push(obj);

          // 7.若当前被增节点是叶子节点，则裁剪该节点子节点属性
          if (name == pathList[pathList.length - 1]) {
            delete obj.children;
          }
        }
        // 8.已有则进入下一层，继续寻找
        _name && (levelList = obj.children);
      }
    });
    return destList;
  }

  forEachTree(tree: Array<INode>, callback: (item: INode) => void) {
    tree?.forEach((item: INode) => {
      callback(item);
      forEachTree(item.children as Array<INode>, callback);
    });
    return tree;
  }

  getItem(name: string, list?: Array<INode>): INode | undefined {
    const root = !list ? this.root : list;
    for (let i = 0; i < root.length; i++) {
      const a = root[i];
      if (a.name === name) {
        return a;
      } else {
        if (a.children && a.children.length > 0) {
          const res = this.getItem(name, a.children);
          if (res) {
            return res;
          }
        }
      }
    }
  }

  getDepItem(str: string) {
    const aim = str.split('_%_%_');
    let prevColl = this.root;
    let name = '';
    while ((name = aim.shift() as string) && prevColl.length) {
      const res = this.getItem(name, prevColl);
      prevColl = res?.children as INode[];
      if (!prevColl) break;
    }
    return prevColl;
  }

  orderTraverse(fn: (item: INode) => void, list?: Array<INode>) {
    const root = !list ? this.root : list;
    for (let i = 0; i < root.length; i++) {
      const item = root[i];

      if (item.children && item.children.length > 0) {
        this.orderTraverse(fn, item.children);
      }
      fn?.(item);
    }
  }
}
