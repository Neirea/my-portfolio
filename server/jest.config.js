export default {
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
    },
    moduleNameMapper: {
        "^(\\.\\.?\\/.+)\\.js$": "$1",
    },
};
