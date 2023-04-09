const Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'user', 'password', {
  host: 'host',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

// Define a "Post" model

var Post = sequelize.define('Post', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN
});

// Define a "Category" model

var Category = sequelize.define('Category', {
  category: Sequelize.STRING
});

// set up association between Post & Category
Post.belongsTo(Category, {foreignKey: 'category'})


module.exports.initialize = function () {
    return sequelize.sync()
}

module.exports.getAllPosts = function () {
    return new Promise((resolve, reject) => {
        Post.findAll().then(data=>{
            resolve(data);
        }).catch( err =>{
            reject("no results returned");
        });
    });
}

module.exports.getPostsByCategory = function (category) {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                category: category
            }
        }).then( data => {
            resolve(data);
        }).catch(() => {
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = function (minDateStr) {

  const { gte } = Sequelize.Op;

  return new Promise((resolve, reject) => {
      Post.findAll({
          where: {
              postDate: {
                  [gte]: new Date(minDateStr)
                }
          }
      }).then( data => {
          resolve(data);
      }).catch((err) => {
          reject("no results returned");
      });
  });
};

const getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true
      }
    })
      .then(posts => {
        if (posts.length === 0) {
          reject('No results returned');
        } else {
          resolve(posts);
        }
      })
      .catch(error => {
        console.error('Error getting published posts', error);
        reject('Error getting published posts');
      });
  });
};

const getPublishedPostsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: categoryId
      }
    })
      .then(posts => {
        if (posts.length === 0) {
          reject('No results returned');
        } else {
          resolve(posts);
        }
      })
      .catch(error => {
        console.error(`Error getting published posts with category ${categoryId}`, error);
        reject(`Error getting published posts with category ${categoryId}`);
      });
  });
};

const addCategory = (categoryData) => {
  // Replace empty values with null
  for (const prop in categoryData) {
    if (categoryData[prop] === '') {
      categoryData[prop] = null;
    }
  }

  return new Promise((resolve, reject) => {
    Category.create(categoryData)
      .then(() => {
        resolve('Category created successfully');
      })
      .catch(error => {
        console.error('Error creating category', error);
        reject('Unable to create category');
      });
  });
};

const deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id
      }
    })
      .then((rowsDeleted) => {
        if (rowsDeleted === 0) {
          reject('Category not found');
        } else {
          resolve('Category deleted successfully');
        }
      })
      .catch(error => {
        console.error(`Error deleting category with id ${id}`, error);
        reject(`Error deleting category with id ${id}`);
      });
  });
};

const deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({ where: { id } })
      .then((deletedRows) => {
        if (deletedRows === 0) {
          reject(`Post with id ${id} not found`);
        } else {
          resolve(`Post with id ${id} deleted successfully`);
        }
      })
      .catch((error) => {
        console.error(`Error deleting post with id ${id}`, error);
        reject(`Error deleting post with id ${id}`);
      });
  });
};



module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
      Post.findAll({
          where: {
              id: id
          }
      }).then( data => {
          resolve(data[0]);
      }).catch((err) => {
          reject("no results returned");
      });
  });
}

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
      postData.published = postData.published ? true : false;

      for (var prop in postData) {
          if (postData[prop] === '')
          postData[prop] = null;
      }

      postData.postDate = new Date();

      Post.create(postData).then(() => {
          resolve();
      }).catch((e) => {
          reject("unable to create post");
      });

  });
}

module.exports.deletePostById = function (id) {
  return new Promise((resolve, reject) => {
      Post.destroy({
          where: {
              id: id
          }
      }).then( data => {
          resolve();
      }).catch(() => {
          reject("unable to delete post");
      });
  });
}

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
      Post.findAll({
          where: {
              published: true
          }
      }).then( data => {
          resolve(data);
      }).catch(() => {
          reject("no results returned");
      });
  });
}

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
      Post.findAll({
          where: {
              published: true,
              category: category
          }
      }).then( data => {
          resolve(data);
      }).catch(() => {
          reject("no results returned");
      });
  });
}

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
      Category.findAll().then(data=>{
          resolve(data);
      }).catch( err =>{
          reject("no results returned")
      });
  });
}

module.exports.addCategory = function (categoryData) {
  return new Promise((resolve, reject) => {

      for (var prop in categoryData) {
          if (categoryData[prop] === '')
          categoryData[prop] = null;
      }

      Category.create(categoryData).then(() => {
          resolve();
      }).catch((e) => {
          reject("unable to create category");
      });

  });
}

module.exports.deleteCategoryById = function (id) {
  return new Promise((resolve, reject) => {
      Category.destroy({
          where: {
              id: id
          }
      }).then( data => {
          resolve();
      }).catch(() => {
          reject("unable to delete category");
      });
  });
}
