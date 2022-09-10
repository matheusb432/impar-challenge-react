import { SharedErrorKeys } from './../types/shared-error-keys.enum';
export const errorMessages = Object.freeze({
  [SharedErrorKeys.NetworkError]:
    'Houve algum erro ao tentar se conectar ao servidor!',
  [SharedErrorKeys.BadRequest]: 'Houve algum erro na requisição!',
  [SharedErrorKeys.Default]: 'Houve algum erro!',
  invalidCardId: 'Não foi possível encontrar o Card com o ID informado!',
});
