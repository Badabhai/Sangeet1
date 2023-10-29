new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Mann Jogiya",
          artist: "Arijit Singh",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/J4w0nxlFWU8h9rHyHj4agdVpBAkkL0mf",
          favorited: false
        },
        {
          name: "Bachalo",
          artist: "Akhil",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/bxC9Bi8J10EPjjaS7X4uKxi4W1MaMGtv",
          favorited: true
        },

        {
          name: "Chalo Mannya",
          artist: "Romaana",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/pdylmQP3ZIod26WI4CxIO92zb1Sv0k2e",
          favorited: false
        },

        {
          name: "Goriyaan_Goriyaan",
          artist: "Romaana",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/eICNjhr9VXCNWOTknv2cQcn3rmz247IA",
          favorited: false
        },
        {
          name: "Jhaanjar",
          artist: "Unknown",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/7oUawHkWSbN9vhuI5YdkbT22kgt5y28Z",
          
          favorited: true
        },
        {
          name: "Kya Hota",
          artist: "Romaana",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/CIjJwg2hkSoHg0gIScLSLqMyxds2wx22",
          favorited: false
        },
        {
          name: "Mann Dolje",
          artist: "Romaana",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/DqvLvgx3ygsHP20et5t8Beqq8gjCxc1v",
          favorited: true
        },
        {
          name: "Mehrbaniyan",
          artist: "Romaana",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/Gmk87g84PghbfSGNznUTCh1DKMfyjc1k",
          favorited: false
        },
        {
          name: "One Love",
          artist: "Shubh",
          cover: "https://i.ibb.co/zxSFJ5V/15.jpg",
          source: "https://audio.jukehost.co.uk/kyCrdurQMousYhSX5GYGkvgm8klQ9KXe",
          favorited: false
        }
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});
