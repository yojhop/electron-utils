
function formatDate(date){
      var day = date.getDate(),
          month = date.getMonth(),
          year = date.getFullYear(),
          hour = date.getHours(),
          minute = date.getMinutes(),
          second = date.getSeconds(),
          miliseconds = date.getMilliseconds(),
          h = hour % 12,
          hh = twoDigitPad(h),
          HH = twoDigitPad(hour),
          mm = twoDigitPad(minute),
          ss = twoDigitPad(second),
          aaa = hour < 12 ? 'AM' : 'PM',
          dd = twoDigitPad(day),
          M = month + 1,
          MM = twoDigitPad(M),
          yyyy = year + "",
          yy = yyyy.substr(2, 2)
      ;
      return 'yyyy-MM-ddTHH:mm:ss.S+08:00'
        .replace('hh', hh).replace('h', h)
        .replace('HH', HH).replace('H', hour)
        .replace('mm', mm).replace('m', minute)
        .replace('ss', ss).replace('s', second)
        .replace('S', miliseconds)
        .replace('dd', dd).replace('d', day).replace('MM', MM).replace('M', M)
        .replace('yyyy', yyyy)
        .replace('yy', yy)
        .replace('aaa', aaa)
      ;
  }
  function twoDigitPad(num) {
      return num < 10 ? "0" + num : num;
  }
  console.log(formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.S+08:00'));