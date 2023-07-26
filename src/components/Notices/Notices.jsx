import { useEffect, useState } from 'react';
import { useAuth } from 'redux/auth/selectors';
import fetchOwnNotices from 'fetch/noticeOwn';
import AddPetBtn from 'helpers/AddPetButton/AddPetBtn';
import fetchFavoriteNotices from 'fetch/noticeFavorite';
import fetchNotices from 'fetch/noticeCategory';
import { AttentionModal } from 'components/Modals/ModalAttention/ModalAttention';
import NoticesCategoriesList from 'components/Notices/NoticesCategories/NoticesCategoriesList/NoticesCategoriesList';
import NoticesCatagoriesNav from 'components/Notices/NoticesCategories/NoticesCatagoriesNav/NoticesCatagoriesNav';
import NoticesFilter from 'components/Notices/NoticesSearch/NoticesSearch';
import { Title } from 'components/Title/title';
import AppPagination from 'components/Pagination/Pagination';
import { NoticeNavContainer } from './Notices.styled';

const Notices = () => {
  const [showAlertModal, setAlertShowModal] = useState(false);
  const [noticeArticles, setNoticeArticles] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('sell');
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [rerender, setRerender] = useState(false);


  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    console.log('rerender :>> ', rerender);

    if (!rerender || !isLoggedIn) return;

    // console.log('rerender :>> ', rerender);
    async function foo(page, query, token) {
        const result = await fetchFavoriteNotices(page, query, token);
        setNoticeArticles(result.notices);
        //  console.log(' fetch result favor:>> ', result);
      setRerender(false);
        setTotalPageCount(Math.ceil(result.total / 12));
    }
    foo(page, query, token);

  }, [isLoggedIn, page, query, rerender, token]);

  useEffect(() => {
    foo(page, category, query, token);


    async function foo(page, category, query, token) {
      if (category === 'favorite') {
        const result = await fetchFavoriteNotices(page, query, token);
        setNoticeArticles(result.notices);
        //  console.log(' fetch result favor:>> ', result);
        setTotalPageCount(Math.ceil(result.total / 12));
      } else if (category === 'my-ads') {
        // console.log(' category my-ads:>> ', category);
        const result = await fetchOwnNotices(page, query, token);
        setNoticeArticles(result.notices);
        setTotalPageCount(Math.ceil(result.total / 12));
        // console.log(' fetch result own:>> ', result);
      } else if (category === 'sell' || 'lost-found' || 'for-free') {
        const result = await fetchNotices(page, category, query);
        setNoticeArticles(result.notices);
        // console.log(' fetch result sell/lost/free:>> ', result)
        setTotalPageCount(Math.ceil(result.total / 12));;
        // console.log(result.total)
       
      }
    }
  }, [page, category, query, token]);

  return (
    <>
      <div>
        <Title text={'Find your favorite pet'} />
        <NoticesFilter setQuery={setQuery} setPage={setPage} />
        <NoticeNavContainer>
          <NoticesCatagoriesNav setCategory={setCategory} setPage={setPage} />
          <AddPetBtn setAlertShowModal={setAlertShowModal} />
        </NoticeNavContainer>
      </div>
      {noticeArticles && (
        <NoticesCategoriesList
          articles={noticeArticles}
          setAlertShowModal={setAlertShowModal}
          setRerender={setRerender}
        />
      )}

      {showAlertModal && (
        <AttentionModal setAlertShowModal={setAlertShowModal} />
      )}
      <AppPagination
        setPage={setPage}
        page={page}
        totalPageCount={totalPageCount}
      />
    </>
  );
};

export default Notices;
