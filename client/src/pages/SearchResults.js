import { Link, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_VINYLS, QUERY_ME } from "../utils/queries";
import { ADD_VINYL } from "../utils/mutations";
import searchResultsImg from './assets/images/logologin.png'

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const variables = Object.fromEntries(params.entries())
  const canSearch = (variables?.q && ('artist' in variables || 'song' in variables || 'genre' in variables))

  const { loading, data } = useQuery(QUERY_VINYLS, canSearch ? { variables } : {});
  const vinyls = data?.vinyls || []


  const { loading: userLoading, data: userData } = useQuery(QUERY_ME);
  const me = userData?.me;

  console.log(userData)
  console.log(me)

  const userVinylIds = me?.vinyl.map((vinyl) => vinyl.id);

  console.log(userVinylIds)

  const [addVinyl, { data: vinylData, loading: vinylLoading, error }] = useMutation(ADD_VINYL);

  const addToFav = async (e, { id, title, cover_image }) => {

    if (!userLoading) {
      e.target.disabled = true
      e.target.textContent = 'Adding to Favorites'
      await addVinyl({
        variables: {
          "userId": me._id,
          "vinylId": parseInt(id),
          "title": title,
          "cover_image": cover_image
        }
      })
      e.target.disabled = false
      e.target.textContent = 'Add to Favorites'
    };
  };



  if (loading) {
    return <h1>loading...</h1>
  };
  return (
    <>
      <main className="container-fluid home min-vh-100">
        <img alt='search Results' src={searchResultsImg} className='justify-item-center'></img>
        <ul className="row justify-content-center mb-0">
          {vinyls.map((vinyl) => {
            return (
              <li
                className="card border border-dark p-3 mt-5 m-3 col-md-3"
                key={vinyl.id}>
                <Link to={`/vinyl/${encodeURIComponent(vinyl.title)}`}>
                  <h2
                    className="text-center fs-3 fw-bold text-muted">{vinyl.title}</h2>
                  <img
                    className="resultImage d-block mx-auto"
                    alt={vinyl.title}
                    src={vinyl.cover_image}
                  />
                </Link>
                {(userVinylIds.includes(vinyl.id)) ? 'here' : 'not here'}
                <button
                  onClick={(e) => addToFav(e, vinyl)}>Add to Favorites
                </button>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
};

export default SearchResults;
