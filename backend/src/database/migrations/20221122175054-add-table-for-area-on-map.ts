import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.createTable(
        'MapArea',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          area: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          cityId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'City',
              key: 'id',
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        }
      ),
      await queryInterface.sequelize.query(`insert into "MapArea" values (1, '[[[34.994530393775705,48.471922343074624],[35.006704040369975,48.46225456026216],[34.99645497684146,48.455862901542375],[35.0042702718896,48.454295043115565],[35.011349828462855,48.469303445192814],[35.02455882677368,48.4661805870265],[35.02209333238919,48.46169879894058],[35.02666349197648,48.4607994343866],[35.028772961366975,48.465174622195605],[35.03261185421313,48.464348717661295],[35.042379892545284,48.45916909823828],[35.044181938121355,48.45817145399832],[35.03154223819436,48.447343997911766],[35.02963566329885,48.44812253431756],[35.01673506314023,48.43323800069621],[35.01454587038543,48.42919155003747],[34.99969063383929,48.43261548685592],[35.00219256841555,48.43686914758362],[34.98108249542841,48.44215978953969],[34.97764233538595,48.44184859056017],[34.97467128807716,48.439566406450666],[34.97201298258969,48.43946266837298],[34.96403806612744,48.44039630344437],[34.972482095322306,48.45699139618074],[34.994530393775705,48.471922343074624]]]', 1)`)
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return Promise.all([
      await queryInterface.dropTable('MapArea')
    ]);
  }
};
