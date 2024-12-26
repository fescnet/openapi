const { AppName } = process.env;

export const a = () => {
  b(AppName || "");
};

export const b = (envVar: string) => {
  console.log(envVar);
};
