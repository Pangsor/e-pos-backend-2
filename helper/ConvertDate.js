import moment from 'moment';

export const dateNow = () =>{
  const formated_date = moment().utc().local().format(`YYYY-MM-DD`);
  const stringDate = formated_date.toString();
  return stringDate;
}
export const dateNowFormat = (pattern) =>{
    const formated_date = moment().utc().local().format(pattern);
    const stringDate = formated_date.toString();
    return stringDate;
  }
