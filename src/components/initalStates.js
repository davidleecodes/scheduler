const employeesInit = {
  e1: {
    name: "amy",
    groupRules: {
      interval: { data: { startDay: "12/31/2023" } },
    },
    offDays: {
      o1: ["02/01/2024", "02/02/2024"],
      o2: ["01/25/2024", "01/29/2024"],
    },
    group: "g1",
  },
  e2: {
    name: "bran",
    // groupRules: {
    //   interval: { data: { startDay: "01/06/2024" } },
    // },
    offDays: {
      o3: ["01/29/2024", "01/30/2024"],
    },
    group: "g3",
  },
  e3: {
    name: "carl",
    groupRules: {
      interval: { data: { startDay: "01/06/2024" } },
    },
    group: "g1",
  },
  e4: {
    name: "dawn",
    group: "g3",
  },
};

const groupsInit = {
  g1: {
    name: "group A",
    employees: ["e1", "e3"],
    groupRules: {
      interval: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 3 } },
    },
  },
  // g2: {
  //   name: "group B",
  //   employees: ["e2"],
  //   groupRules: {
  //     interval: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 2 } },
  //   },
  // },
  g3: {
    name: "group C",
    employees: ["e4", "e2"],
  },
};

const scheduleRangeInt = {
  // selectedDate: "",

  // selectedDate: "12/12/2023",
  numOfWks: 6,
};

const daysOffPerWeekInt = 5;

const codeInt = {
  Sun: {
    Sun1: { name: "a10", shift: "morning" },
    Sun2: { name: "b10", shift: "morning" },
    Sun3: { name: "b30", shift: "evening" },
  },
  Mon: {
    Mon1: { name: "a10", shift: "morning" },
    Mon2: { name: "b10", shift: "morning" },
    Mon3: { name: "b30", shift: "evening" },
  },
  Tue: {
    Tue1: { name: "a10", shift: "morning" },
    Tue2: { name: "b10", shift: "morning" },
    Tue3: { name: "b30", shift: "evening" },
  },
  Wed: {
    Wed1: { name: "a10", shift: "morning" },
    Wed2: { name: "b10", shift: "morning" },
    Wed3: { name: "b30", shift: "evening" },
  },
  Thu: {
    Thu1: { name: "a10", shift: "morning" },
    Thu2: { name: "b10", shift: "morning" },
    Thu3: { name: "b30", shift: "evening" },
  },
  Fri: {
    Fri1: { name: "a10", shift: "morning" },
    Fri2: { name: "b10", shift: "morning" },
    Fri3: { name: "b30", shift: "evening" },
  },
  Sat: {
    Sat1: { name: "a10", shift: "morning" },
    Sat2: { name: "b10", shift: "morning" },
    Sat3: { name: "b30", shift: "evening" },
  },
  Add: {
    Add1: { name: "x", shift: "none" },
    Add2: { name: "v", shift: "none" },
    Add3: { name: "h", shift: "none" },
  },
  Internal: { x: { name: "x" }, h: { name: "h" }, v: { name: "v" } },
  // Add: ["x", "y", "z"],
};

export {
  employeesInit,
  groupsInit,
  scheduleRangeInt,
  codeInt,
  daysOffPerWeekInt,
};
