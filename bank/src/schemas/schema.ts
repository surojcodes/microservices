import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

const types = loadFilesSync(__dirname, { extensions: ["graphql"] });

export default mergeTypeDefs(types);
