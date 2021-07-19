export default async (
  data: { isCommandAvailable: boolean },
  func: () => Promise<void | boolean>
) => {
  data.isCommandAvailable = true;
  const state = await func();
  data.isCommandAvailable = false;
  return state === undefined || state;
};
