import {
  mapActions
} from 'vuex'
export const initTask = {
  methods: {
    ...mapActions(["saveAddTaskObj"]),
    handleInitTask() {
      this.saveAddTaskObj({
        id: null,
        type: Number,
        name: "",
        priority: "",
        screen_style: "",
        duration: '',
        videoLayoutType: 1,
        videoLayoutName: "布局选择",
        videoLayoutList: [{
            active: false,
            disabled: false,
            hasAudio: true,
            checked: false,
            file: [],
            type: 1
          },
          {
            active: false,
            disabled: false,
            hasAudio: false,
            checked: false,
            file: [],
            type: 2
          },
          {
            active: false,
            disabled: false,
            hasAudio: false,
            checked: false,
            file: [],
            type: 3
          },
          {
            active: false,
            disabled: false,
            hasAudio: false,
            checked: false,
            file: [],
            type: 4
          }
        ],
        handleSaveMember: [],
        dateList: [],
        weekList: [{
            id: 1,
            active: false,
            name: "周一"
          },
          {
            id: 2,
            active: false,
            name: "周二"
          },
          {
            id: 3,
            active: false,
            name: "周三"
          },
          {
            id: 4,
            active: false,
            name: "周四"
          },
          {
            id: 5,
            active: false,
            name: "周五"
          },
          {
            active: false,
            id: 6,
            name: "周六"
          },
          {
            active: false,
            id: 0,
            name: "周日"
          }
        ],
        timeList: [{
          name: "播放时间",
          time: "",
          first: true
        }],
        cycleTypeList: [{
            name: "按周重复",
            runType: 1,
            active: true
          },
          {
            name: "指定日期",
            runType: 2,
            active: false
          },
          {
            name: "手动控制",
            runType: 3,
            active: false
          }
        ],
        durationLock: false,
        taskList: [],
        audioList: []
      });
    }
  }
}