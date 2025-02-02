const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsChildrenEducation', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_receipt: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_eligible: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_university: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_other: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('DRAFT','WAIT_VERIFY','APPROVED'),
      allowNull: false
    },
    spouse: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    marry_regis: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    welfare_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sub_categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_children_education',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_users1_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};