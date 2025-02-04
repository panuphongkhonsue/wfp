const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('permissionsHasRoles', {
    permissions_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    roles_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'permissions_has_roles',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "permissions_id" },
          { name: "roles_id" },
        ]
      },
      {
        name: "fk_permissions_has_roles_roles1_idx",
        using: "BTREE",
        fields: [
          { name: "roles_id" },
        ]
      },
      {
        name: "fk_permissions_has_roles_permissions1_idx",
        using: "BTREE",
        fields: [
          { name: "permissions_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};