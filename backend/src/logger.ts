const logger = {
  debug: (...arg: Array<any>) => {
    console.log(new Date().toISOString(), "DEBUG", ...arg);
  },
  info: (...arg: Array<any>) => {
    console.log(new Date().toISOString(), "INFO", ...arg);
  },
  warn: (...arg: Array<any>) => {
    console.log(new Date().toISOString(), "WARN", ...arg);
  },
};

export default logger;
