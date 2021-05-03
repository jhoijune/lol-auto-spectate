export default async (
  data: { isCommandAvailable: boolean },
  func: () => Promise<void>
) => {
  data.isCommandAvailable = true;
  await func();
  data.isCommandAvailable = false;
};
