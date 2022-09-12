import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '../assets/styles/styles.scss';
import { Card, CardCreate, CardEdit, useCardApi } from '../feature/Card';
import { CardContextLayout } from '../feature/Card/store/context';
import { Home } from '../feature/Home';
import {
  paginationQuery,
  QueryStatuses,
  RouteSuffixes,
  RouteUrls,
} from '../types';

const urls = { ...RouteUrls };
const suffixes = { ...RouteSuffixes };

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CardContextLayout />}>
          <Route path="/" element={<Navigate to={urls.Cards} />} />
          <Route path={urls.Cards} element={<Card />}>
            <Route path={suffixes.Create} element={<CardCreate />} />
            <Route path={`${suffixes.Edit}/:id`} element={<CardEdit />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRouter;
