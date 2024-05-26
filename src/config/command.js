import { Command } from "commander";

const program = new Command();

program.option("--dao <dao>", "Persistencia", "MONGO");
program.parse();

export default program;
