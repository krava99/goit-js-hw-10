import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('[data-start]'),
  day: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

const currentDate = new Date().getTime();

refs.button.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);

    const selectDate = selectedDates[0];
    if (selectDate - currentDate < 0) {
      iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
    } else {
      refs.button.disabled = false;
      refs.input.disabled = true;
      refs.button.addEventListener('click', handlerClick);
    }
  },
};

function handlerClick() {
  iziToast.success({
    position: 'topRight',
    message: 'Timer is running!',
  });
  refs.button.disabled = true;
  let selectDate = new Date(refs.input.value).getTime();
  let ms = Math.floor((selectDate - currentDate) / 1000) * 1000;
  updformatTime(ms);
  let id = setInterval(() => {
    ms -= 1000;
    console.log(ms);

    if (ms <= 0) {
      clearInterval(id);
      iziToast.success({
        position: 'topRight',
        message: 'Timer is end!',
      });
    }
    updformatTime(ms);
  }, 1000);
}
function formatTime(value) {
  return value.toString().padStart(2, '0');
}

function updformatTime(ms) {
  refs.day.textContent = formatTime(convertMs(ms).days);
  refs.hours.textContent = formatTime(convertMs(ms).hours);
  refs.minutes.textContent = formatTime(convertMs(ms).minutes);
  refs.seconds.textContent = formatTime(convertMs(ms).seconds);
}

flatpickr(refs.input, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
