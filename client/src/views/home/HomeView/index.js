import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  getUserPreferences,
} from "src/components/auth/UserAuth";
import {
  Box,
  Container,
  makeStyles,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import Page from "src/components/theme/page";
// import { getExampleRecipes } from "src/api/mockAPI";
import { getRandomRecommendedRecipes } from "src/components/api/SpoonacularAPI";
import RecipeInfoDialog from "src/views/home/HomeView/components/RecipeInfoDialog";
import RecipeCardList from "src/views/home/HomeView/components/RecipeCardList";
import { Scrollbars } from "react-custom-scrollbars";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(0);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState({});
  const [dlgOpen, setDlgOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [intolerances, setIntolerances] = useState([]);
  const [diet, setDiet] = useState("");
  const [tags, setTags] = useState("");

  const onRecipeClick = (id) => {
    loadRecipeById(id);
    setSelectedRecipeId(id);
  };

  // USED FOR TESTING
  // useEffect(() => {
  //   setRecipes(getExampleRecipes());
  // }, []);

  useLayoutEffect(() => {
    getUserPreferences().then((res) => {
      setIntolerances(res.data.allergens);
      setDiet(res.data.diet);
      const userDietLowerCase = res.data.diet ? res.data.diet.toLowerCase() : null;
      const userIntolerancesArray = res.data.allergens ? res.data.allergens.join(',').toLowerCase() : null;
      const tags = userIntolerancesArray ? [userDietLowerCase, userIntolerancesArray] : [userDietLowerCase];
      console.log(tags)
      setTags(tags);
      loadRandomRecommendedRecipes(
        tags,
        0,
      );
    });
  }, []);

  const loadMoreRecipes = () => {
    loadRandomRecommendedRecipes(
      tags
    );
  };

  return (
    <Scrollbars>
      <Page className={classes.root} title="Recipedia | Home">
        <Container maxWidth="false">
          <Card variant="outlined">
            <CardContent>
              <Box p={1}>
                <Typography gutterBottom variant="h1">
                  Welcome home.
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  View our delightful assortment of recipes, curated just for
                  you.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
        <Container maxWidth={false}>
          <Box mt={3}>
            <RecipeCardList
              recipes={recipes}
              onRecipeClick={onRecipeClick}
              loadMore={loadMoreRecipes}
              loading={loading}
            />
          </Box>
        </Container>
        <RecipeInfoDialog
          open={dlgOpen}
          handleClose={() => setDlgOpen(false)}
          recipeId={selectedRecipeId}
          recipeInfo={selectedRecipeInfo}
        />
      </Page>
    </Scrollbars>
  );

  function loadRandomRecommendedRecipes(
    tagsArray,
  ) {
    setLoading(true);
    let tagsString = tagsArray ? tagsArray.join(",") : null
    if (tagsString == "none") {
      tagsString = "";
    }
    getRandomRecommendedRecipes(
      tagsString,
    )
      .then((res) => {
        // console.log("recipes:", res.data);
        setRecipes([...recipes, ...res.data.recipes])
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  }
  
  function loadRecipeById(id) {
    const clickedRecipe = recipes.find((recipe) => recipe.id === id);
    // console.log(clickedRecipe);
    setSelectedRecipeInfo(clickedRecipe);
    setDlgOpen(true);
  }
};

export default Home;
