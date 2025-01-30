const Sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate');
module.exports = function(sequelize, DataTypes) {
  const reimbursementsChildrenEducation = sequelize.define('reimbursementsChildrenEducation', {
    id: {
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
    role: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    welfare_type: {
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
    child_type: {
      type: DataTypes.ENUM('DELEGATE','COMMON'),
      allowNull: false,
      unique: "child_type_UNIQUE"
    },
    school: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    education_level: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    father_child: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mother_child: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    draft_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approve_date: {
      type: DataTypes.DATE,
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
    created_by_children: {
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
        name: "child_type_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "child_type" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_users1_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
          { name: "created_by_children" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(reimbursementsChildrenEducation);

  return reimbursementsChildrenEducation;
};
