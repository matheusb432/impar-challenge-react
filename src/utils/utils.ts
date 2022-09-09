const sleep = async (ms: number): Promise<any> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const sortArrayByProp = <T>(arr: T[], prop: keyof T): void => {
  arr.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
};

export { sleep, sortArrayByProp };
