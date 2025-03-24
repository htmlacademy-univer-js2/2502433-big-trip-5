import { DateFormats, EVENT_TYPES } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { formatDate } from '../utils.js';

function createEditPointFormTemplate(point, allOffers, destinations) {
  const {price, dateFrom, dateTo, destination, offers, type} = point;
  const pointTypeOffers = allOffers.find((offer) => offer.type === type);
  const destinationInfo = destinations.find((item) => item.id === destination);
  const renderDestinationsList = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${EVENT_TYPES.map((eventType) => (`<div class="event__type-item">
                                      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''}>
                                      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label></div>`)).join('')}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo.name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${renderDestinationsList}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DateFormats.FULL_DATE)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DateFormats.FULL_DATE)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${pointTypeOffers.offers.map((offer) => (`<div class="event__offer-selector">
                                <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${offers.includes(offer.id) ? 'checked' : ''}>
                                <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
                                  <span class="event__offer-title">${offer.title}</span>
                                  &plus;&euro;&nbsp;
                                  <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`)).join('')}
                    </div>
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationInfo.description}</p>
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${destinationInfo.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
                      </div>
                    </div>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class EventEditorView extends AbstractView {
  #point = null;
  #offers = null;
  #destinations = null;
  #handleFormSubmit = null;
  #handleFormReset = null;

  constructor({point, offers, destinations, onFormSubmit, onFormReset}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormReset = onFormReset;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formResetHandler);
  }

  get template() {
    return createEditPointFormTemplate(this.#point, this.#offers, this.#destinations);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #formResetHandler = () => {
    this.#handleFormReset();
  };
}
