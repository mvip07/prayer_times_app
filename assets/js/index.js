const APIBASE = "http://api.aladhan.com/v1/calendar/";

const GEO = navigator.geolocation;
let today = new Date();
let month = `${today.getMonth() + 1 < 10 ? "0" : " "}${today.getMonth() + 1}`;
let year = `${today.getFullYear()}`;

const prayerContainer = document.querySelector(".prayer-default-slider");
const select = document.querySelector(".select");

GEO.getCurrentPosition(function (position) {
  const { longitude, latitude } = position.coords;

  if (longitude && latitude) {
    fetch(
      `${APIBASE}${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=2`
    )
      .then((res) => res.json())
      .then((res) => {
        chooseButton(res.data);
        add_prayer_time(res.data);
        add_time_on_select(res.data);

        get_loader();
      })
      .catch((err) => console.log(err));
  }
});

function add_prayer_time(data) {
  prayerContainer.innerHTML = "";
  for (let i of data) {
    prayerContainer.innerHTML += `
        <div class="prayer__default--single">
			<div class="prayer__date">
				<p class="prayer__link">${i?.date.hijri.date}</p>
				<span class="prayer__price">${i?.date.readable}</span>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Fajr:</p>
				<p class="prayer__link">${i?.timings.Fajr}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Sunrise: </p>
				<p class="prayer__link">${i?.timings.Sunrise}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Dhuhr:</p>
				<p class="prayer__link">${i?.timings.Dhuhr}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Asr:</p>
				<p class="prayer__link">${i?.timings.Asr}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Maghrib</p>
				<p class="prayer__link">${i?.timings.Maghrib}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Sunset:</p>
				<p class="prayer__link">${i?.timings.Sunset}</p>
			</div>

			<div class="prayer__times">
				<p class="prayer__link">Isha:</p>
				<p class="prayer__link">${i?.timings.Isha}</p>
			</div>
        </div>
	`;
  }
}

function chooseButton(prayerDate) {
  const todayBtn = document.querySelector(".today");
  const month = document.querySelector(".month");

  todayBtn.addEventListener("click", () => {
    const day = new Date().getUTCDate();
    prayerDate.filter((i) =>
      i.date.readable.substr(0, 2) == day ? add_prayer_time([i]) : ""
    );
  });

  month.addEventListener("click", () => add_prayer_time(prayerDate));

  select.addEventListener("change", ({ target }) => {
    prayerDate.filter((i) => {
      i.date.readable == target.value ? add_prayer_time([i]) : "";
    });
  });
}

function add_time_on_select(prayerDate) {
  for (let i of prayerDate) {
    select.innerHTML += `
            <option value='${i.date.readable}'>${i.date.readable}</option>
        `;
  }
}

function get_loader() {
  const body = document.querySelector("body");
  const loader = document.querySelector(".loader");
  const mainContainer = document.querySelector(".main-container");

  body.classList.remove("hidden");
  loader.classList.remove("active");
  mainContainer.classList.remove("blur");
}
