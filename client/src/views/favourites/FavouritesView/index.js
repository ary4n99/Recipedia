import React, { useState } from "react";
import {
  Box,
  Container,
  makeStyles,
  Card,
  Typography,
  CardContent,
} from "@material-ui/core";
import Page from "src/components/theme/page";
// import { getExampleRecipes } from "src/api/mockAPI";
import { Scrollbars } from "react-custom-scrollbars";
import FavRecipeDialog from "src/views/favourites/FavouritesView/components/FavRecipeDialog";
import FavRecipeList from "src/views/favourites/FavouritesView/components/FavRecipeList";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
}));

const Favourites = () => {
  const classes = useStyles();
  const [recipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(0);
  const [selectedRecipeInfo, setSelectedRecipeInfo] = useState({});
  const [dlgOpen, setDlgOpen] = useState(false);

  const onRecipeClick = (id) => {
    loadRecipeById(id);
    setSelectedRecipeId(id);
  };

  // useEffect(() => {
  //   setRecipes(getExampleRecipes());
  // }, []);

  return (
    <Scrollbars>
      <Page className={classes.root} title="Recipedia | Favourites">
        <Box m={2}>
          <Container maxWidth="false">
            <Card variant="outlined">
              <CardContent>
                <Box p={1}>
                  <Typography gutterBottom variant="h1">
                    Your favourites.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    You can view and manage your favourite recipes right here.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Container>
          <Container maxWidth={false}>
            <Box mt={3}>
              <FavRecipeList recipes={recipes} onRecipeClick={onRecipeClick} />
            </Box>
          </Container>
          <FavRecipeDialog
            open={dlgOpen}
            handleClose={() => setDlgOpen(false)}
            recipeId={selectedRecipeId}
            recipeInfo={selectedRecipeInfo}
          />
        </Box>
      </Page>
    </Scrollbars>
  );

  function loadRecipeById(id) {
    const clickedRecipe = recipes.find((recipe) => recipe.id === id);
    setSelectedRecipeInfo(clickedRecipe);
    setDlgOpen(true);
  }
};

export default Favourites;
