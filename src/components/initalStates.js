const employeesInit = {
  e1: {
    name: "amy",
    groupRules: {
      interval: { data: { startDay: "12/31/2023" } },
    },
    offDays: {
      o1: { days: ["02/24/2024", "02/26/2024"], code: "v" },
      o2: { days: ["03/01/2024", "03/02/2024"], code: "Leave1" },
    },
    shiftDays: {
      Mon: "always",
      Tue: "normal",
      Wed: "normal",
      Thu: "normal",
      Fri: "never",
      Sat: "normal",
      Sun: "normal",
    },
    group: "g1",
  },
  e2: {
    name: "bran",
    // groupRules: {
    //   interval: { data: { startDay: "01/06/2024" } },
    // },
    offDays: {
      o3: { days: ["03/11/2024", "03/12/2024"], code: "Leave1" },
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
  e5: {
    name: "ellen",
  },
};

const groupsInit = {
  g1: {
    name: "group A",
    employees: ["e1", "e3"],
    groupRules: {
      interval: { data: { days: ["Sat", "Sun"], everyNumberOfWeeks: 3 } },
      maxShift: { data: { numberOfShifts: 4 } },
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
    Mon1: { name: "d10", shift: "morning" },
    Mon2: { name: "b10", shift: "morning" },
    Mon3: { name: "b30", shift: "evening" },
  },
  Tue: {
    Tue1: { name: "c10", shift: "morning" },
    Tue2: { name: "b10", shift: "morning" },
    Tue3: { name: "b30", shift: "evening" },
  },
  Wed: {
    Wed1: { name: "e10", shift: "morning" },
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

  Leave: {
    v: {
      name: "v",
      shift: "leave",
      noShift: true,
      noDelete: true,
      notes: "default vacation",
    },
    Leave1: { name: "h", shift: "leave", noShift: true },
    Leave2: { name: "e", shift: "leave", noShift: true },
  },
  Add: {
    x: {
      name: "x",
      shift: "none",
      noShift: true,
      noDelete: true,
      notes: "marks days to not be assigned",
    },
    Add1: { name: "c", shift: "morning" },
  },
  // Internal: { x: { name: "x" }, h: { name: "h" }, v: { name: "v" } },
  // Add: ["x", "y", "z"],
};

export {
  employeesInit,
  groupsInit,
  scheduleRangeInt,
  codeInt,
  daysOffPerWeekInt,
};
