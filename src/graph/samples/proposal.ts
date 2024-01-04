import { ElementsDefinition } from "cytoscape";

export const proposalSample: ElementsDefinition = {
  nodes: [
    {
      data: {
        id: "proposal-v1",
        text: "We should pay Volky 15 ETH to create an iOS Negation Game app",
        version: 1,
      },
      classes: ["point", "proposal"],
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BBCR0P8C553H7ZE4CWY1P",
        id: "01HJRTCQJNCSRBMPDYYPGHP8D8",
        text: "We should support android users too",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRTDEEZ4QAW2X9FJ2WB60DB",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BBS7872HBRQV5NTVTG4GE",
        id: "01HJRWJXWVKJ7DZ0W8VKH0KWRG",
        text: "Volky has no experience developing iOS apps",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRWK08D2CHPM1QF4218MV9D",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BBY48NRXSM6M1GE1JX3MF",
        id: "01HJRWNPZCR2R35R2GJSYYMARM",
        text: "It's all code in the end",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRWNSP0Q99QRTPJ0N9D7M1T",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BC55WZA8V0SS4S5VT4FP6",
        id: "01HJRWSHWP6B3J7Y6AS75Q15C4",
        text: "15 ETH is half of our treasury. We shouldn't expend that much",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BC55WZA8V0SS4S5VT4FP6",
        id: "01HK848ZJANPHKNBWRS0VPHKSB",
        text: "15 ETH is half of our treasury. We shouldn't expend that much",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRWSM59E3BYDTN4ZAXG4Q6Q",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BCHH281DCD9YDWPMYACVQ",
        id: "01HJRWVDCWKT2B1YT76J9FRZDY",
        text: "We've spent more than that buying a NFT recently",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRWVG0FXX9W7GT5K3ZA1A1D",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BCQ8PV8QT66X03KER14K1",
        id: "01HJRWYG8EKVK872041Q1TZJ0J",
        text: "That NFT is very special!",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRWYJBZ4TSV7BAHY5WE2HWP",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BCY1F2ATA1NF9KBEXCZNP",
        id: "01HJRX2GDHP2NF26T4WMYG1RH9",
        text: "We should invest in AI instead",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRX2KV5THYQRTGQSFZF6WZ7",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BD43REG19HZJCMJZB3DS3",
        id: "01HJRX4GSGHNY39S18FC29EPM7",
        text: "We can invest in both",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRX4K2ZRQEJ79431RPYK5M7",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        id: "01HJRX8GEG1Z7QJD0EQWH8BD6D",
      },
      classes: "relevance",
    },
    {
      data: {
        conviction: 1,
        pointId: "01HK8BDAGQPBKD6D5055QESSQ2",
        id: "01HK7END4JNMFK6VZN08645FCM",
        text: "This point has 320 characters. yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada yada",
      },
      classes: "point",
    },
    {
      data: {
        conviction: 1,
        id: "01HK7ENJTESXPBFQYP548XPZCZ",
      },
      classes: "relevance",
    },
  ],
  edges: [
    {
      data: {
        source: "01HJRTCQJNCSRBMPDYYPGHP8D8",
        target: "01HJRTDEEZ4QAW2X9FJ2WB60DB",
      },
      classes: "has",
    },
    {
      data: { source: "01HJRTDEEZ4QAW2X9FJ2WB60DB", target: "proposal-v1" },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRWJXWVKJ7DZ0W8VKH0KWRG",
        target: "01HJRWK08D2CHPM1QF4218MV9D",
      },
      classes: "has",
    },
    {
      data: { source: "01HJRWK08D2CHPM1QF4218MV9D", target: "proposal-v1" },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRWNPZCR2R35R2GJSYYMARM",
        target: "01HJRWNSP0Q99QRTPJ0N9D7M1T",
      },
      classes: "has",
    },
    {
      data: {
        source: "01HJRWNSP0Q99QRTPJ0N9D7M1T",
        target: "01HJRWK08D2CHPM1QF4218MV9D",
      },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRWSHWP6B3J7Y6AS75Q15C4",
        target: "01HJRWSM59E3BYDTN4ZAXG4Q6Q",
      },
      classes: "has",
    },
    {
      data: { source: "01HJRWSM59E3BYDTN4ZAXG4Q6Q", target: "proposal-v1" },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRWVDCWKT2B1YT76J9FRZDY",
        target: "01HJRWVG0FXX9W7GT5K3ZA1A1D",
      },
      classes: "has",
    },
    {
      data: {
        source: "01HJRWVG0FXX9W7GT5K3ZA1A1D",
        target: "01HJRWSM59E3BYDTN4ZAXG4Q6Q",
      },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRWYG8EKVK872041Q1TZJ0J",
        target: "01HJRWYJBZ4TSV7BAHY5WE2HWP",
      },
      classes: "has",
    },
    {
      data: {
        source: "01HJRWYJBZ4TSV7BAHY5WE2HWP",
        target: "01HJRWVG0FXX9W7GT5K3ZA1A1D",
      },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRX2GDHP2NF26T4WMYG1RH9",
        target: "01HJRX2KV5THYQRTGQSFZF6WZ7",
      },
      classes: "has",
    },
    {
      data: { source: "01HJRX2KV5THYQRTGQSFZF6WZ7", target: "proposal-v1" },
      classes: "negating",
    },
    {
      data: {
        source: "01HJRX4GSGHNY39S18FC29EPM7",
        target: "01HJRX4K2ZRQEJ79431RPYK5M7",
      },
      classes: "has",
    },
    {
      data: {
        source: "01HJRX4K2ZRQEJ79431RPYK5M7",
        target: "01HJRX2GDHP2NF26T4WMYG1RH9",
      },
      classes: "negating",
    },
    {
      data: {
        source: "01HK848ZJANPHKNBWRS0VPHKSB",
        target: "01HJRX8GEG1Z7QJD0EQWH8BD6D",
      },
      classes: "has",
    },
    {
      data: {
        source: "01HJRX8GEG1Z7QJD0EQWH8BD6D",
        target: "01HJRX4GSGHNY39S18FC29EPM7",
      },
      classes: "negating",
    },
    {
      data: {
        source: "01HK7END4JNMFK6VZN08645FCM",
        target: "01HK7ENJTESXPBFQYP548XPZCZ",
      },
      classes: "has",
    },
    {
      data: { source: "01HK7ENJTESXPBFQYP548XPZCZ", target: "proposal-v1" },
      classes: "negating",
    },
  ],
};
