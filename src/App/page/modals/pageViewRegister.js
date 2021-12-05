import React from 'react';
const EditPageView = React.lazy(() => import('./editPageView'));
const DetailPageView = React.lazy(() => import('./detailPageView'));
const DetailRichPageView = React.lazy(() => import('./detailRichPageView'));
const SearchListPageView = React.lazy(() => import('./searchListPageView'));
const ModifyPageView = React.lazy(() => import('./modifyPageView'));
const TabLayoutPageView = React.lazy(() => import('./tabLayoutPageView'));
const GridLayoutPageView = React.lazy(() => import('./gridLayoutPageView'));
const EditTableView = React.lazy(() => import('./editTableView'));
const AddPage = React.lazy(() => import('./addPageView'));
const CardsPage = React.lazy(() => import('./cardsPageView'));

export default {
    Edit: EditPageView,
    Detail: DetailPageView,
	DetailRich:DetailRichPageView,
	SearchList:SearchListPageView,
	Modify:ModifyPageView,
    TabLayout:TabLayoutPageView,
    GridLayout: GridLayoutPageView,
    EditTable: EditTableView,
    AddPage: AddPage,
    CardsPage: CardsPage
}
